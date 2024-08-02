package com.sbs.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.sbs.domain.Member;
import com.sbs.persistence.MemberRepository;

@Service
public class MemberDetailService implements UserDetailsService {
	
	@Autowired
	private MemberRepository memRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Member member = memRepo.findById(username).orElseThrow(()->new UsernameNotFoundException("Not Found"));
		System.out.println(member);
		
		return new User(member.getUsername(), member.getPassword(), 
				AuthorityUtils.createAuthorityList(member.getRoles().toString()));
	}
	

}
