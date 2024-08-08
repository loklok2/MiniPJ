package com.sbs.domain;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateMemberRequest {
    private String nickname;
    private String password; // 비밀번호는 선택적으로 업데이트
}
