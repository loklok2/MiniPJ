package com.sbs.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString  // Lombok 애너테이션으로 getter, setter, toString 메서드를 자동으로 생성합니다.
@Builder  // Lombok 애너테이션으로 빌더 패턴을 지원합니다.
@AllArgsConstructor  // 모든 필드를 매개변수로 받는 생성자를 자동으로 생성합니다.
@NoArgsConstructor  // 매개변수가 없는 기본 생성자를 자동으로 생성합니다.
@Entity  // 이 클래스가 JPA 엔티티임을 나타내며, 데이터베이스 테이블과 매핑됩니다.
public class Member {
<<<<<<< HEAD
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String username;
	private String password;
	@Enumerated(EnumType.STRING)
	private Role roles;
	
	
	private String nickname; // 8/5 닉네임추가
	private String verificationToken; // 이메일 인증 토큰
	private boolean enabled; //이메일 인증여부
=======
	
	@Id  // 이 필드가 엔티티의 기본 키임을 나타냅니다.
	@GeneratedValue(strategy = GenerationType.IDENTITY)  // 기본 키 값을 데이터베이스에서 자동 생성합니다.
	private Long id;  // 회원 고유 ID
	
	private String username;  // 회원의 사용자명 (로그인 ID)
	private String password;  // 회원의 비밀번호
	
	@Enumerated(EnumType.STRING)  // Enum 타입 필드를 문자열로 저장하도록 설정합니다.
	private Role roles;  // 회원의 권한 정보를 나타내는 Enum 타입 필드
	
	private String nickname;  // 회원의 닉네임 (8/5 닉네임 추가)
	private String verificationToken;  // 이메일 인증을 위한 토큰
	private boolean enabled;  // 이메일 인증 여부를 나타내는 플래그
	
	
	private String resetPasswordToken;
	private LocalDateTime resetPasswordTokenExpiry;
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
}
