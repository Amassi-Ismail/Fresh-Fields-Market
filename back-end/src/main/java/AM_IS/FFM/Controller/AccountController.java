package AM_IS.FFM.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;


import AM_IS.FFM.Model.User;
import AM_IS.FFM.Service.UserService;

@RestController
@RequestMapping("/account")
public class AccountController {
  @Autowired
  private UserService userService;
  @Autowired


 @GetMapping("/test")
 public ResponseEntity<String> sayHello() {
   return ResponseEntity.ok("Hello from secured endpoint");
 }

  @GetMapping("/account-details")
  public ResponseEntity<Optional<User>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
    Optional<User> user = userService.findUserByEmail(userDetails.getUsername());
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @GetMapping("/all")
  public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.ViewAllUsers();
    return new ResponseEntity<>(users, HttpStatus.OK);
  }

  @GetMapping("/find/{id}")
  public ResponseEntity<Optional<User>> getUserById(@PathVariable("id") Long id) {
    Optional<User> user = userService.FindUserById(id);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }

  @PutMapping("/activate/{userId}")
  public ResponseEntity<String> activateUser(@PathVariable("userId") Long userId) {
    return new ResponseEntity<>(userService.activateUser(userId), HttpStatus.ACCEPTED);
  }

  @PutMapping("/deactivate/{userId}")
  public ResponseEntity<String> deactivateUser(@PathVariable(name = "userId") Long userId) {
    return new ResponseEntity<>(userService.deactivateUser(userId), HttpStatus.ACCEPTED);
  }

  @DeleteMapping("/delete/{userId}")
  public ResponseEntity<String> deleteUser(@PathVariable(name = "userId") Long userId) {
    return new ResponseEntity<>(userService.deleteUser(userId), HttpStatus.ACCEPTED);
  }

  @PutMapping("/update/{userId}")
  public ResponseEntity<User> updateUser(@PathVariable("userId") Long userId, @RequestBody User updatedUser) {
    User user = userService.updateUser(userId, updatedUser);
    return new ResponseEntity<>(user, HttpStatus.OK);
  }


}
