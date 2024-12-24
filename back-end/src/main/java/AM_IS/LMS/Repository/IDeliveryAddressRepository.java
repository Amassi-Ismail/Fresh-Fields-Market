package AM_IS.LMS.Repository;

import AM_IS.LMS.Model.DeliveryAddress;
import AM_IS.LMS.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IDeliveryAddressRepository extends JpaRepository<DeliveryAddress, Long> {
  Optional<List<DeliveryAddress>> getDeliveryAddressesByUser(Optional<User> user);
}
