package AM_IS.FFM.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import AM_IS.FFM.Model.User;
import AM_IS.FFM.Repository.IUserRepository;


@Service
public class UserService {
  @Autowired
  private IUserRepository iUserRepository;

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
}

