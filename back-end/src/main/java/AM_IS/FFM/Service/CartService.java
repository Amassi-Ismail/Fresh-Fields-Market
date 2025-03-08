package AM_IS.FFM.Service;

import AM_IS.FFM.Model.*;
import AM_IS.FFM.Repository.CartRepository;
import AM_IS.FFM.Repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
            .orElseGet(() -> {
                Cart newCart = new Cart();
                newCart.setUser(user);
                return cartRepository.save(newCart);
            });
    }

    @Transactional
    public Cart addItemToCart(User user, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(user);
        Item item = itemRepository.findById(itemId)
            .orElseThrow(() -> new RuntimeException("Item not found"));

        // Check if item already exists in cart
        CartItem existingItem = cart.getItems().stream()
            .filter(cartItem -> cartItem.getItem().getId().equals(itemId))
            .findFirst()
            .orElse(null);

        if (existingItem != null) {
            // Update quantity if item exists
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // Add new item if it doesn't exist
            CartItem cartItem = CartItem.builder()
                .cart(cart)
                .item(item)
                .quantity(quantity)
                .build();
            cart.getItems().add(cartItem);
        }

        // Update total price
        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItemFromCart(User user, Long itemId) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().removeIf(cartItem -> cartItem.getItem().getId().equals(itemId));
        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateItemQuantity(User user, Long itemId, Integer quantity) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().stream()
            .filter(cartItem -> cartItem.getItem().getId().equals(itemId))
            .findFirst()
            .ifPresent(cartItem -> cartItem.setQuantity(quantity));
        updateCartTotal(cart);
        return cartRepository.save(cart);
    }

    public Cart getCart(User user) {
        return cartRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Cart not found"));
    }

    public void clearCart(User user) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        cart.setTotalPrice(0.0);
        cartRepository.save(cart);
    }

    private void updateCartTotal(Cart cart) {
        double total = cart.getItems().stream()
            .mapToDouble(item -> item.getItem().getPrice() * item.getQuantity())
            .sum();
        cart.setTotalPrice(total);
    }
}