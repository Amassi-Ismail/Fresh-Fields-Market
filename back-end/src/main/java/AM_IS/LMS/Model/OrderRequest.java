package AM_IS.LMS.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderRequest {
  private List<Item> items;
  private BigDecimal totalPrice;
  private DeliveryAddress deliveryAddress;
  private PaymentMethod paymentMethod;
}
