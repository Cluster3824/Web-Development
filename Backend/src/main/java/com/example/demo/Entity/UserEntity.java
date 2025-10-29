package com.example.demo.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private String password;

    @Column(nullable = false)
    private String role = "USER";

    private boolean banned = false;
    
    private String profileImage;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isBanned() { return banned; }
    public void setBanned(boolean banned) { this.banned = banned; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}
