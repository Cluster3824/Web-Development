package com.example.demo.Service;

import com.example.demo.Entity.UserEntity;
import com.example.demo.Repos.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    UserEntity user = userRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    String authority = "ROLE_" + user.getRole().toUpperCase();
    return org.springframework.security.core.userdetails.User
        .withUsername(user.getUsername())
        .password(user.getPassword())
        .authorities(authority)
        .build();
    }
}
