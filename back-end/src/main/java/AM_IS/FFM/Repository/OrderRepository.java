package AM_IS.FFM.Repository;

import AM_IS.FFM.Model.Order;
import AM_IS.FFM.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserOrderByOrderDateDesc(User user);
}