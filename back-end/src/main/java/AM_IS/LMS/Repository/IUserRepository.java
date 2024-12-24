package AM_IS.LMS.Repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import AM_IS.LMS.Model.User;

public interface IUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
