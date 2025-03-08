package AM_IS.FFM.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import AM_IS.FFM.Model.Item;
import AM_IS.FFM.Repository.ItemRepository;

import java.util.List;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item addItem(Item item) {
        return itemRepository.save(item);
    }

    public List<Item> addItems(List<Item> items) {
        return itemRepository.saveAll(items);
    }

    public boolean checkStockAvailability(Long itemId, int quantity) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return item.getStock() >= quantity;
    }

    public void updateStock(Long itemId, Integer newStock) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        item.setStock(newStock);
        itemRepository.save(item);
    }

    public int getItemStock(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return item.getStock();
    }

    public void decrementStock(Long itemId, int quantity) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (item.getStock() < quantity) {
            throw new IllegalArgumentException("Insufficient stock for item: " + item.getName());
        }
        item.setStock(item.getStock() - quantity);
        itemRepository.save(item);
    }
}