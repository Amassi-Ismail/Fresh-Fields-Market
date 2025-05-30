package AM_IS.FFM.Config;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private static final String SECRET_KEY = "dl6aQ4JS2CYx0Csi/gP/OwYoOGuFQrZvzt9+YoABnSo4iikqsizC7AXWFX7Fs6Eb8m4GaUTk6wGDr4g+q0GkrBjYf6aHHteyc9GvuZOoIoVx45tXfmg3k3M7g41FFvh/MsphUPs4ZeJIZCVz0Re3P8SLVk1DYA41i75aVBmv3En7VqoPApklVgl5xhIvJ6EM9xDlmqMo5wtDDvERuah/0YGgqu8DKBF4lTtSMqw1YwRRi497G43UTgbxoackq41DXvOUDdWx48++RrKhkgYNeM1PacO2g9h1PlylykUhc5/TLJp/FhP+58BPp9OSgcVKy6CdHdmaKbQARfalSWcFGZoqVuLwttXCCFiItdNOeuc=\n";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
      }

    private Claims extractAllClaims(String token){
        return Jwts
        .parser()
        .verifyWith(getSignInKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
      } 

    public String generateToken(
      Map<String, Object> extraClaims,
      UserDetails userDetails
  ) {
    return Jwts
            .builder()
            .claims(extraClaims)
            .subject(userDetails.getUsername())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
            .signWith(getSignInKey(), Jwts.SIG.HS256)
            .compact();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
}

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
