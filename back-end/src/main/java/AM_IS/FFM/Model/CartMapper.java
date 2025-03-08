package AM_IS.FFM.Model;

import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

@Component
public class CartMapper {
    
    public CartDTO toDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        dto.setId(cart.getId());
        dto.setTotalPrice(cart.getTotalPrice());
        dto.setItems(cart.getItems().stream()
            .map(this::toCartItemDTO)
            .collect(Collectors.toList()));
        return dto;
    }

    private CartItemDTO toCartItemDTO(CartItem cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());
        dto.setQuantity(cartItem.getQuantity());
        dto.setItem(toItemDTO(cartItem.getItem()));
        return dto;
    }

    private ItemDTO toItemDTO(Item item) {
        ItemDTO dto = new ItemDTO();
        dto.setId(item.getId());
        dto.setName(item.getName());
        dto.setPrice(item.getPrice());
        dto.setImageUrl(item.getImageUrl());
        dto.setDescription(item.getDescription());
        return dto;
    }
}
