package AM_IS.LMS.Repository;

import AM_IS.LMS.Model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IOrderRepository extends JpaRepository<Order, Long> {


}
