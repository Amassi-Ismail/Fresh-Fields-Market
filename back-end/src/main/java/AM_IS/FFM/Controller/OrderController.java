package AM_IS.FFM.Controller;

import AM_IS.FFM.Model.Order;
import AM_IS.FFM.Model.OrderItem;
import AM_IS.FFM.Model.OrderStatus;
import AM_IS.FFM.Model.User;
import AM_IS.FFM.Service.OrderService;
import AM_IS.FFM.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Order> createOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<OrderItem> items) {
        User user = userService.findUserByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        Order order = orderService.createOrder(user, items);
        return ResponseEntity.ok(order);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Order>> getOrderHistory(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        List<Order> orders = orderService.getUserOrders(user);
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam OrderStatus status) {
        Order updatedOrder = orderService.updateOrderStatus(orderId, status);
        return ResponseEntity.ok(updatedOrder);
    }
}