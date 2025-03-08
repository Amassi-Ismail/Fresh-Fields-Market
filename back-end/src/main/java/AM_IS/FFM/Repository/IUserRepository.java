package AM_IS.FFM.Repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import AM_IS.FFM.Model.User;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
