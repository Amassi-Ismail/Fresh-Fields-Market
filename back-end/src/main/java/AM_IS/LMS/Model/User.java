package AM_IS.LMS.Model;


import java.util.Collection;


import jakarta.persistence.*;
import lombok.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User implements UserDetails {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String firstname;
  private String lastname;
  @Column(nullable = false, unique = true)
  private String email;
  private String password;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Role role;


  @Builder.Default
  private boolean enable = true;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return java.util.List.of(new SimpleGrantedAuthority(role.name()));
  }

  @Override
  public String getUsername() {
    return email;
  }

}
