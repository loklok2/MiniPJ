package com.sbs.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter @ToString  // Lombok 애너테이션으로 getter, setter, toString 메서드를 자동으로 생성합니다.
public class SignupRequest {
<<<<<<< HEAD
	
	private String username; //8/5 username이라고 해놓고 이메일이라고 하자
	private String password;
	private String nickname; //8/5 닉네임 필드추가
=======
    
    private String username;  // 8/5: username이라고 명명했지만 실제로는 이메일로 사용될 필드
    private String password;  // 사용자가 설정한 비밀번호
    private String nickname;  // 8/5: 닉네임 필드를 추가하여 사용자의 별명 또는 닉네임을 저장
    
>>>>>>> 39f029607ac6fbf2f2b70ef3312d7de8be263b46
}
