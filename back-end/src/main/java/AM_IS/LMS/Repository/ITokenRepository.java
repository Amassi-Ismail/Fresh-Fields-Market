package AM_IS.LMS.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import AM_IS.LMS.Model.Token;

public interface ITokenRepository extends JpaRepository<Token, Long> {

    @Query("""
            select t from Token t inner join User u
            on t.user.id = u.id
            where u.id = :userId and (t.expired = false or t.revoked = false)
            """)
    List<Token> findAllValidTokenByUser(Long userId);

    Optional<Token> findByToken(String token);
}
