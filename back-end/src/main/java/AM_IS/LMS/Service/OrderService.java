package AM_IS.LMS.Service;

import AM_IS.LMS.Model.Item;
import AM_IS.LMS.Model.Order;

import AM_IS.LMS.Repository.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class OrderService {
  @Autowired
  private IOrderRepository orderRepository;

  public Order createOrder(Order order) {
    return orderRepository.save(order);
  }


  public void addOrderedItems(Long orderId, List<Item> items) {
    Order order = orderRepository.findById(orderId)
      .orElseThrow(() -> new RuntimeException("Order not found"));
    order.getOrderedItems().addAll(items);
    orderRepository.save(order);
  }
}
