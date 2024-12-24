package AM_IS.LMS.Model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
public class Order {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Date orderDate;
  private BigDecimal totalPrice;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user; // Link to User entity with @ManyToOne
  
  @OneToMany
  private List<Item> orderedItems; // List of items

  @OneToOne(cascade = CascadeType.ALL)
  private DeliveryAddress deliveryAddress; // Delivery address

  @OneToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "payment_id")
  private PaymentMethod paymentMethod;
}
