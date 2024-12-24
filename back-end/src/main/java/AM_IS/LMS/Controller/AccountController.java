package AM_IS.LMS.Controller;

import java.util.List;
import java.util.Optional;

import AM_IS.LMS.Model.DeliveryAddress;
import AM_IS.LMS.Model.PaymentMethod;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import AM_IS.LMS.Model.User;
import AM_IS.LMS.Service.UserService;

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

  @PostMapping("/add-payment-method")
  public ResponseEntity<PaymentMethod> addPaymentMethod(@AuthenticationPrincipal User user, @RequestBody PaymentMethod paymentMethod) {
    PaymentMethod createdPayment = userService.addPaymentMethod(user.getId(), paymentMethod);
    return new ResponseEntity<>(createdPayment, HttpStatus.CREATED);
  }

  @PostMapping("/add-address")
  public ResponseEntity<DeliveryAddress> addAddress(@AuthenticationPrincipal User user, @RequestBody DeliveryAddress address) {
    DeliveryAddress createdAddress = userService.addAddress(user.getId(), address);
    return new ResponseEntity<>(createdAddress, HttpStatus.CREATED);
  }

  @GetMapping("/get-payment-methods")
  public ResponseEntity<Optional<List<PaymentMethod>>> getPaymentMethods(@AuthenticationPrincipal User user) {
    Optional<List<PaymentMethod>> paymentMethods = userService.getPaymentMethods(user.getId());
    return new ResponseEntity<>(paymentMethods, HttpStatus.OK);
  }

  @GetMapping("/get-addresses")
  public ResponseEntity<Optional<List<DeliveryAddress>>> getAddresses(@AuthenticationPrincipal User user) {
    Optional<List<DeliveryAddress>> addresses = userService.getAddresses(user.getId());
    return new ResponseEntity<>(addresses, HttpStatus.OK);
  }

  @DeleteMapping("/delete-payment")
  public ResponseEntity<Void> deletePaymentMethod(@RequestBody PaymentMethod paymentMethod) {
    userService.deletePaymentMethod(paymentMethod.getId());
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }

  @DeleteMapping("/delete-address/{addressId}")
  public ResponseEntity<Void> deleteAddress(@PathVariable(name = "addressId") Long addressId) {
    userService.deleteAddress(addressId);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
