package AM_IS.FFM.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import AM_IS.FFM.Model.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
    public List<Item> findByAisle(String aisle);

}
