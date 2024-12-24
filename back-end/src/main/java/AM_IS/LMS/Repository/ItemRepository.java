package AM_IS.LMS.Repository;

import AM_IS.LMS.Model.Item;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
    public List<Item> findByAisle(String aisle);

}
