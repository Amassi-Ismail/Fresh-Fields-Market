package AM_IS.LMS.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class PaymentMethod {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String cardNumber;
  private String cardHolderName;
  private String expirationDate; // Consider using a better type for dates.


  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

}
