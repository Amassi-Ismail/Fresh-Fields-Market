package AM_IS.LMS.Repository;

import AM_IS.LMS.Model.PaymentMethod;
import AM_IS.LMS.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IPaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
  Optional<List<PaymentMethod>> getPaymentMethodsByUser(Optional<User> user);
}
