package AM_IS.FFM.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import AM_IS.FFM.Authentication.AuthenticationRequest;
import AM_IS.FFM.Authentication.AuthenticationResponse;
import AM_IS.FFM.Authentication.RegisterRequest;
import AM_IS.FFM.Service.AuthenticationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private final AuthenticationService service;
    
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> Register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(service.register(request));

    }

    @PostMapping("/login")
  public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
    return ResponseEntity.ok(service.authenticate(request));
  }

    
}