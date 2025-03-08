package AM_IS.FFM.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import AM_IS.FFM.Model.Item;
import AM_IS.FFM.Repository.ItemRepository;
import AM_IS.FFM.Service.ItemService;

import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    @Autowired
    private ItemService itemService;
    @Autowired
    private ItemRepository itemRepository;

    @GetMapping("/all")
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    @GetMapping("/{aisle}")
    public List<Item> getItemsByAisle(@PathVariable String aisle) {
        if (aisle != null) {
            return itemRepository.findByAisle(aisle);
        }
        return itemRepository.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<Item> addItem(@RequestBody Item item) {
        Item createdItem = itemService.addItem(item);
        return new ResponseEntity<>(createdItem, HttpStatus.CREATED);
    }

    @PostMapping("/add-bulk")
    public ResponseEntity<List<Item>> addItems(@RequestBody List<Item> items) {
        List<Item> createdItems = itemService.addItems(items);
        return new ResponseEntity<>(createdItems, HttpStatus.CREATED);
    }

    @PutMapping("/{itemId}/stock")
    public ResponseEntity<Item> updateItemStock(@PathVariable Long itemId, @RequestParam Integer newStock) {
        itemService.updateStock(itemId, newStock);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{itemId}/stock")
    public ResponseEntity<Integer> getItemStock(@PathVariable Long itemId) {
        int currentStock = itemService.getItemStock(itemId);
        return new ResponseEntity<>(currentStock, HttpStatus.OK);
    }

    @DeleteMapping("/delete-all")
  public ResponseEntity<String> deleteAllItems() {
      itemRepository.deleteAll();
      return new ResponseEntity<>("All items deleted", HttpStatus.OK);
    }
}
