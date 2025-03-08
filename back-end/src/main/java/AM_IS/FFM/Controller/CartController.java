package AM_IS.FFM.Controller;

import AM_IS.FFM.Model.Cart;
import AM_IS.FFM.Model.CartDTO;
import AM_IS.FFM.Model.CartMapper;
import AM_IS.FFM.Model.User;
import AM_IS.FFM.Service.CartService;
import AM_IS.FFM.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private UserService userService;

    @Autowired
    private CartMapper cartMapper;

    @GetMapping
    public ResponseEntity<CartDTO> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        Cart cart = cartService.getCart(user);
        return ResponseEntity.ok(cartMapper.toDTO(cart));
    }

    @PostMapping("/add/{itemId}")
    public ResponseEntity<CartDTO> addToCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        User user = userService.findUserByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        Cart updatedCart = cartService.addItemToCart(user, itemId, quantity);
        return ResponseEntity.ok(cartMapper.toDTO(updatedCart));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<CartDTO> removeFromCart(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        User user = userService.findUserByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        Cart updatedCart = cartService.removeItemFromCart(user, itemId);
        return ResponseEntity.ok(cartMapper.toDTO(updatedCart));    
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<CartDTO> updateQuantity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        User user = userService.findUserByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        Cart updatedCart = cartService.updateItemQuantity(user, itemId, quantity);
        return ResponseEntity.ok(cartMapper.toDTO(updatedCart));    
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userService.findUserByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        cartService.clearCart(user);
        return ResponseEntity.ok().build();
    }
}