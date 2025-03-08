package AM_IS.FFM.Repository;

import AM_IS.FFM.Model.Cart;
import AM_IS.FFM.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}