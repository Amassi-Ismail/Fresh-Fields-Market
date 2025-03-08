package AM_IS.FFM.Service;

import AM_IS.FFM.Model.*;
import AM_IS.FFM.Repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ItemService itemService;

    @Transactional
    public Order createOrder(User user, List<OrderItem> items) {
        // Calculate total price
        double totalPrice = items.stream()
            .mapToDouble(item -> item.getPriceAtTime() * item.getQuantity())
            .sum();

        // Create new order
        Order order = Order.builder()
            .user(user)
            .items(items)
            .orderDate(LocalDateTime.now())
            .totalPrice(totalPrice)
            .status(OrderStatus.ORDER_PLACED)
            .build();

        // Set order reference in items
        items.forEach(item -> {
            item.setOrder(order);
            // Decrease stock
            itemService.decrementStock(item.getItem().getId(), item.getQuantity());
        });

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}