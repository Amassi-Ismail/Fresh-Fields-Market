package AM_IS.FFM.Service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import AM_IS.FFM.Authentication.AuthenticationRequest;
import AM_IS.FFM.Authentication.AuthenticationResponse;
import AM_IS.FFM.Authentication.RegisterRequest;
import AM_IS.FFM.Config.JwtService;
import AM_IS.FFM.Model.Role;
import AM_IS.FFM.Model.Token;
import AM_IS.FFM.Model.TokenType;
import AM_IS.FFM.Model.User;
import AM_IS.FFM.Repository.ITokenRepository;
import AM_IS.FFM.Repository.IUserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final IUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final ITokenRepository iTokenRepository;

    public AuthenticationResponse register(RegisterRequest request) {
        User u = new User();
        u.setRole(Role.Customer);

        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(u.getRole())
                .build();

        if (repository.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalStateException("Email already exists!");
        } else {
            var savedUser = repository.save(user);
            var jwtToken = jwtService.generateToken(user);
            saveUserToken(savedUser, jwtToken);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        }

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = iTokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        iTokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .expired(false)
                .build();
        iTokenRepository.save(token);
    }
}
