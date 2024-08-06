# 프로젝트 개요

이 프로젝트는 Spring Boot를 기반으로 한 웹 애플리케이션입니다. 주요 기능으로는 회원가입, 로그인, 비밀번호 찾기 및 OAuth2 소셜 로그인 기능을 제공합니다.

## 주요 기능

1. **회원가입**
2. **로그인**
3. **비밀번호 찾기**
4. **OAuth2 소셜 로그인**

---

## 프로젝트 설정

### 요구사항

- Java 17 이상
- Spring Boot 3.3.0
- MySQL
- Maven

## 기능 설명 및 동작 원리

### 1. 회원가입

#### 동작 순서

1. **사용자 입력**: 사용자가 회원가입 양식을 통해 이메일, 비밀번호, 닉네임 등을 입력합니다.
2. **컨트롤러 처리**: `AuthController` 클래스의 `/signup` 엔드포인트가 요청을 처리합니다.
3. **서비스 호출**: `MemberService`의 `registerUser()` 메서드가 호출되어 새로운 사용자를 등록합니다.
4. **이메일 인증**: 회원가입 후, 사용자에게 이메일 인증 링크가 전송됩니다. 사용자는 이메일을 확인하고 인증을 완료해야 계정이 활성화됩니다.

#### 관련 클래스 및 메서드

- `AuthController`
    - `signup(SignupRequest signupRequest)`
- `MemberService`
    - `registerUser(SignupRequest signupRequest)`
- `EmailService`
    - `sendVerificationEmail(String toEmail, String verificationLink)`

### 2. 로그인

#### 동작 순서

1. **사용자 입력**: 사용자가 로그인 양식을 통해 이메일과 비밀번호를 입력합니다.
2. **컨트롤러 처리**: `LoginController` 클래스의 `/api/login` 엔드포인트가 요청을 처리합니다.
3. **인증 처리**: `MemberDetailService`가 사용자의 인증 정보를 데이터베이스에서 로드하고, 인증이 성공하면 JWT 토큰이 발급됩니다.
4. **토큰 반환**: 발급된 JWT 토큰이 응답으로 반환되며, 클라이언트는 이 토큰을 사용해 이후 요청에서 인증을 유지합니다.

#### 관련 클래스 및 메서드

- `LoginController`
    - `login(LoginRequest loginRequest)`
- `MemberDetailService`
    - `loadUserByUsername(String username)`
- `JWTUtil`
    - `getJWT(String username)`

### 3. 비밀번호 찾기

#### 동작 순서

1. **사용자 요청**: 사용자가 비밀번호 재설정 요청을 보냅니다.
2. **컨트롤러 처리**: `PasswordResetController`의 `/api/auth/reset-password` 엔드포인트가 요청을 처리합니다.
3. **토큰 생성 및 이메일 전송**: `PasswordResetService`에서 재설정 토큰을 생성하고, 이메일을 통해 사용자에게 전송합니다.
4. **비밀번호 재설정**: 사용자가 이메일 링크를 클릭하면, 새로운 비밀번호를 입력할 수 있는 폼이 제공되며, 입력된 비밀번호는 암호화되어 저장됩니다.

#### 관련 클래스 및 메서드

- `PasswordResetController`
    - `sendPasswordResetLink(String email)`
    - `resetPassword(String token, String newPassword)`
- `PasswordResetService`
    - `sendPasswordResetLink(String email)`
    - `resetPassword(String token, String newPassword)`
- `EmailService`
    - `sendPasswordResetEmail(String toEmail, String resetLink)`

### 4. OAuth2 소셜 로그인

#### 동작 순서

1. **소셜 로그인 요청**: 사용자가 소셜 로그인 버튼을 클릭하여 OAuth2 인증을 요청합니다.
2. **OAuth2 인증 처리**: 인증 성공 시, `OAuth2SuccessHandler`가 호출되어 사용자의 정보를 처리하고, 새로운 사용자로 등록하거나 JWT 토큰을 발급합니다.
3. **토큰 반환**: 발급된 JWT 토큰이 응답으로 반환되며, 클라이언트는 이 토큰을 사용해 인증된 요청을 보낼 수 있습니다.

#### 관련 클래스 및 메서드

- `OAuth2SuccessHandler`
    - `onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)`
- `CustomMyUtil`
    - `getUsernameFromOAuth2User(OAuth2User user)`
- `JWTUtil`
    - `getJWT(String username)`

---


## 보안 고려사항

- **비밀번호 암호화**: 모든 비밀번호는 데이터베이스에 저장되기 전에 `PasswordEncoder`를 사용해 암호화됩니다.
- **JWT 토큰**: JWT 토큰은 HMAC256 알고리즘으로 서명되어 있으며, 만료 시간과 함께 관리됩니다.
- **이메일 인증**: 모든 신규 회원은 계정 활성화를 위해 이메일 인증을 완료해야 합니다.

---

