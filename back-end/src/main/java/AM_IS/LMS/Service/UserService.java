package AM_IS.LMS.Service;

import java.util.List;
import java.util.Optional;

import AM_IS.LMS.Model.DeliveryAddress;
import AM_IS.LMS.Model.PaymentMethod;
import AM_IS.LMS.Repository.IDeliveryAddressRepository;
import AM_IS.LMS.Repository.IPaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import AM_IS.LMS.Model.User;
import AM_IS.LMS.Repository.IUserRepository;


@Service
public class UserService {
  @Autowired
  private IUserRepository iUserRepository;
  @Autowired
  private IDeliveryAddressRepository iDeliveryAddressRepository;
  @Autowired
  private IPaymentMethodRepository iPaymentMethodRepository;


  public List<User> ViewAllUsers() {
    return iUserRepository.findAll();
  }

  public Optional<User> findUserByEmail(String email) {
    return iUserRepository.findByEmail(email);
  }

  public Optional<User> FindUserById(Long id) {
    return iUserRepository.findById(id);
  }

  public String activateUser(Long userId) {
    User user = iUserRepository.findById(userId)
      .orElseThrow(() -> new UsernameNotFoundException(userId + " doesn't exist"));
    if (user.isEnabled()) {
      throw new UsernameNotFoundException(userId + " Already Active!");
    }
    user.setEnable(true);
    iUserRepository.save(user);
    return "Activation Success";
  }

  public String deactivateUser(Long userId) {
    User user = iUserRepository.findById(userId)
      .orElseThrow(() -> new UsernameNotFoundException(userId + " doesn't exist"));
    if (!user.isEnable()) {
      throw new UsernameNotFoundException(userId + " Already Inactive!");
    }
    user.setEnable(false);
    iUserRepository.save(user);

    return "Deactivation Success";
  }

  public String deleteUser(Long userId) {
    iUserRepository.findById(userId)
      .orElseThrow(() -> new UsernameNotFoundException(userId + " doesn't exist"));
    iUserRepository.deleteById(userId);
    return "Deleted Successfully";
  }

  public User updateUser(Long userId, User updatedUser) {
    User existingUser = iUserRepository.findById(userId)
      .orElseThrow(() -> new UsernameNotFoundException("User with ID " + userId + " doesn't exist"));
    existingUser.setFirstname(updatedUser.getFirstname());
    existingUser.setLastname(updatedUser.getLastname());
    return iUserRepository.save(existingUser);
  }

  public PaymentMethod addPaymentMethod(Long userId, PaymentMethod paymentMethod) {
    User user = iUserRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    paymentMethod.setUser(user);
    // user.getPaymentMethods().add(paymentMethod);
    iUserRepository.save(user);
    return paymentMethod;
  }

  public DeliveryAddress addAddress(Long userId, DeliveryAddress address) {
    User user = iUserRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    address.setUser(user);
    iUserRepository.save(user);
    iDeliveryAddressRepository.save(address);
    return address;
  }

  public Optional<List<PaymentMethod>> getPaymentMethods(Long userId) {
    return iPaymentMethodRepository.getPaymentMethodsByUser(iUserRepository.findById(userId));
  }

  public Optional<List<DeliveryAddress>> getAddresses(Long userId) {
    return iDeliveryAddressRepository.getDeliveryAddressesByUser(iUserRepository.findById(userId));
  }

//   public List<Order> getOrdersByUser(Long userId) {
//     User user = iUserRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
//     return user.getOrders();
//   }

  public void deletePaymentMethod(Long paymentMethodId) {
    iPaymentMethodRepository.deleteById(paymentMethodId);
  }

  public void deleteAddress(Long addressId) {
    iDeliveryAddressRepository.deleteById(addressId);
  }
}

