package AM_IS.LMS.Controller;

import AM_IS.LMS.Model.*;
import AM_IS.LMS.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
  @Autowired
  private OrderService orderService;

  @Transactional
  @PostMapping("/add")
  public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest, @AuthenticationPrincipal User user) {
    List<Item> items = orderRequest.getItems();
    BigDecimal totalPrice = orderRequest.getTotalPrice();
    DeliveryAddress deliveryAddress = orderRequest.getDeliveryAddress();
    PaymentMethod paymentMethod = orderRequest.getPaymentMethod();
    Order order = Order.builder().orderedItems(items)
            .orderDate(new Date())
            .totalPrice(totalPrice)
            .user(user)
            .deliveryAddress(deliveryAddress)
            .paymentMethod(paymentMethod)
            .build();
    return new ResponseEntity<>(orderService.createOrder(order), HttpStatus.CREATED);
  }

}
