# SBS SpringBoot 

이 스프링 부트 애플리케이션은 사용자 등록, 로그인, 아이디 찾기, 비밀번호 재설정, 게시판 관리 및 댓글 기능을 구현한 기본 웹 애플리케이션입니다. 아래는 각 클래스의 기능과 구현된 주요 기능, 그리고 사용된 의존성에 대한 설명입니다.

## 프로젝트 구조

### 설정 클래스

1. **`CorsConfig`**
   - CORS(Cross-Origin Resource Sharing)를 설정하여 `http://localhost:3000` 도메인에서 오는 요청을 허용합니다.
   - GET, POST, PUT, DELETE와 같은 HTTP 메서드를 허용합니다.

2. **`CustomConfig`**
   - 비밀번호 암호화를 위한 `BCryptPasswordEncoder` 빈을 정의합니다.

3. **`SecurityConfig`**
   - 스프링 시큐리티 설정을 담당하며, 인증, 인가 및 CSRF 보호를 구성합니다.
   - ADMIN, MANAGER, MEMBER와 같은 역할에 따라 접근 권한을 설정합니다.
   - 폼 기반 로그인, 로그아웃 및 OAuth2 로그인 기능을 통합합니다.

### 실행 및 유틸리티 클래스

1. **`AdminRunner`**
   - 애플리케이션 시작 시 기본 관리자 계정을 생성합니다.
   - `CommandLineRunner`를 구현하여 애플리케이션이 시작될 때 실행됩니다.

2. **`JWTUtil`**
   - JWT 토큰을 생성하고 검증하는 유틸리티 클래스입니다.
   - JWT 토큰의 만료 여부 확인 및 사용자 이름 클레임 추출 기능을 제공합니다.

3. **`CustomMyUtil`**
   - OAuth2 사용자 정보로부터 사용자명을 생성하는 유틸리티 클래스입니다.

### 인증 및 인가 필터

1. **`JWTAuthenticationFilter`**
   - 사용자가 로그인할 때 인증을 처리하는 필터입니다.
   - 인증 성공 시 JWT 토큰을 생성하여 응답 헤더에 추가합니다.

2. **`JWTAuthorizationFilter`**
   - 각 요청에 대해 JWT 토큰을 검증하고 사용자 정보를 설정하는 필터입니다.

### 도메인 클래스

1. **`Member`**
   - 회원 정보를 담고 있는 엔티티 클래스입니다.
   - 사용자명, 비밀번호, 권한, 이메일 인증 토큰 등을 포함합니다.

2. **`Board`**
   - 게시판 글 정보를 담고 있는 엔티티 클래스입니다.
   - 제목, 내용, 작성자 닉네임, 생성 및 수정 날짜를 포함합니다.

3. **`Comment`**
   - 댓글 정보를 담고 있는 엔티티 클래스입니다.
   - 댓글 내용, 작성자, 작성된 게시글, 작성 시간 등을 포함합니다.

4. **`SignupRequest`, `LoginRequest`, `AuthResponse`, `ResetPasswordRequest`, `FindUsernameRequest`, `CreateCommentRequest`**
   - 회원가입, 로그인, 인증 응답, 비밀번호 재설정 요청, 아이디 찾기 요청, 댓글 작성에 사용되는 데이터 전송 객체(DTO)들입니다.

### 리포지토리 클래스

1. **`MemberRepository`**
   - `Member` 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리입니다.
   - 사용자명, 이메일 인증 토큰, 비밀번호 재설정 토큰으로 회원을 조회하는 메서드를 제공합니다.

2. **`BoardRepository`**
   - `Board` 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리입니다.

3. **`CommentRepository`**
   - `Comment` 엔티티에 대한 데이터베이스 작업을 처리하는 JPA 리포지토리입니다.
   - 특정 게시글에 달린 댓글을 조회하는 메서드를 제공합니다.

### 서비스 클래스

1. **`MemberService`**
   - 회원가입, 이메일 인증, 아이디 찾기, 비밀번호 재설정 기능을 처리합니다.
   - 이메일 인증과 비밀번호 재설정을 위한 이메일 전송 기능도 포함됩니다.

2. **`BoardService`**
   - 게시판 글의 생성, 조회, 수정, 삭제 기능을 제공합니다.

3. **`CommentService`**
   - 댓글의 생성, 조회, 수정, 삭제 기능을 제공합니다.

4. **`EmailService`**
   - 이메일 인증 및 비밀번호 재설정을 위한 이메일을 발송하는 서비스 클래스입니다.

5. **`MemberDetailService`**
   - Spring Security의 `UserDetailsService`를 구현하여 사용자 인증 정보를 로드합니다.

### 컨트롤러 클래스

1. **`AuthController`**
   - 회원가입, 이메일 인증, 아이디 찾기, 비밀번호 재설정과 관련된 REST API를 제공합니다.

2. **`BoardController`**
   - 게시판 글과 관련된 CRUD(생성, 조회, 수정, 삭제) REST API를 제공합니다.

3. **`CommentController`**
   - 댓글과 관련된 CRUD(생성, 조회, 수정, 삭제) REST API를 제공합니다.
   - 특정 게시글에 달린 모든 댓글을 조회하거나, 댓글을 작성, 수정, 삭제하는 기능을 제공합니다.

4. **`LoginController`**
   - 로그인 요청을 처리하고 JWT 토큰을 발급하는 REST API를 제공합니다.

## 데이터베이스 스키마

### 테이블 구성 정보

#### 1. `member` 테이블
- **설명**: 사용자 정보를 저장하는 테이블입니다.
- **컬럼**:
  - `id` (bigint, PK, AUTO_INCREMENT): 고유 식별자
  - `username` (varchar(255), UNIQUE, NOT NULL): 사용자 이름
  - `password` (varchar(255), NOT NULL): 비밀번호
  - `role` (varchar(255), NULL): 사용자 역할
  - `enabled` (bit(1), NOT NULL): 계정 활성화 여부
  - `nickname` (varchar(255), UNIQUE, NULL): 닉네임
  - `temporary_password` (bit(1), NULL): 임시 비밀번호 여부
  - `join_date` (datetime(6), NULL): 가입 일자
- **키**:
  - `PRIMARY KEY (id)`
  - `UNIQUE KEY (username)`
  - `UNIQUE KEY (nickname)`

#### 2. `token` 테이블
- **설명**: 사용자의 인증 토큰을 저장하는 테이블입니다.
- **컬럼**:
  - `id` (bigint, PK, AUTO_INCREMENT): 고유 식별자
  - `token_type` (varchar(255), NOT NULL): 토큰 타입
  - `token_value` (varchar(255), NOT NULL): 토큰 값
  - `expiry_date` (datetime, NULL): 토큰 만료일자
  - `member_id` (bigint, FK, NOT NULL): `member` 테이블의 `id`를 참조
- **키**:
  - `PRIMARY KEY (id)`
  - `FOREIGN KEY (member_id)` - `member(id)`와 연관

#### 3. `board` 테이블
- **설명**: 게시판의 게시글을 저장하는 테이블입니다.
- **컬럼**:
  - `id` (bigint, PK, AUTO_INCREMENT): 고유 식별자
  - `title` (varchar(255), NOT NULL): 게시글 제목
  - `content` (varchar(255), NULL): 게시글 내용
  - `author_nickname` (varchar(255), NULL): 작성자 닉네임
  - `author_id` (bigint, FK, NOT NULL): `member` 테이블의 `id`를 참조
  - `create_date` (datetime, DEFAULT CURRENT_TIMESTAMP): 작성일자
  - `update_date` (datetime, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정일자
- **키**:
  - `PRIMARY KEY (id)`
  - `FOREIGN KEY (author_id)` - `member(id)`와 연관

#### 4. `comment` 테이블
- **설명**: 게시글에 대한 댓글을 저장하는 테이블입니다.
- **컬럼**:
  - `id` (bigint, PK, AUTO_INCREMENT): 고유 식별자
  - `content` (varchar(255), NOT NULL): 댓글 내용
  - `create_date` (datetime, DEFAULT CURRENT_TIMESTAMP): 작성일자
  - `board_id` (bigint, FK, NOT NULL): `board` 테이블의 `id`를 참조
  - `author_id` (bigint, FK, NOT NULL): `member` 테이블의 `id`를 참조
- **키**:
  - `PRIMARY KEY (id)`
  - `FOREIGN KEY (board_id)` - `board(id)`와 연관 (ON DELETE CASCADE)
  - `FOREIGN KEY (author_id)` - `member(id)`와 연관

### 테이블 간 관계 매핑

#### 1. `member` (1) - (N) `token`
- **관계**: 1:N (일대다)
- **설명**: 하나의 `member`는 여러 `token`을 가질 수 있습니다. 따라서, `token` 테이블에서 다수의 레코드가 `member` 테이블의 하나의 레코드에 연결될 수 있습니다.

#### 2. `member` (1) - (N) `board`
- **관계**: 1:N (일대다)
- **설명**: 하나의 `member`는 여러 `board`를 작성할 수 있습니다. 즉, `board` 테이블의 여러 레코드가 하나의 `member` 레코드에 연결될 수 있습니다.

#### 3. `board` (1) - (N) `comment`
- **관계**: 1:N (일대다)
- **설명**: 하나의 `board`는 여러 `comment`를 가질 수 있습니다. 즉, `comment` 테이블의 여러 레코드가 하나의 `board` 레코드에 연결될 수 있습니다.

#### 4. `member` (1) - (N) `comment`
- **관계**: 1:N (일대다)
- **설명**: 하나의 `member`는 여러 `comment`를 작성할 수 있습니다. 따라서, `comment` 테이블의 여러 레코드가 하나의 `member` 레코드에 연결될 수 있습니다.

## 사용된 의존성

이 프로젝트는 다양한 스프링 부트 스타터와 기타 라이브러리를 사용하여 구성되었습니다.

### 주요 의존성

- **`spring-boot-starter-data-jpa`**: JPA(Java Persistence API)를 사용하여 데이터베이스 작업을 처리합니다.
- **`spring-boot-starter-security`**: Spring Security를 사용하여 인증 및 인가를 처리합니다.
- **`spring-boot-starter-web`**: RESTful 웹 애플리케이션을 구축하기 위해 Spring MVC와 내장된 톰캣 서버를 제공합니다.
- **`spring-boot-starter-oauth2-client`**: OAuth2 로그인을 위한 클라이언트 지원을 제공합니다.
- **`spring-boot-starter-mail`**: 이메일 전송을 위한 기능을 제공합니다.
- **`mysql-connector-j`**: MySQL 데이터베이스와의 연결을 지원하는 드라이버입니다.
- **`lombok`**: 보일러플레이트 코드를 줄이기 위해 사용되는 라이브러리로, getter, setter, toString, 생성자 등을 자동 생성합니다.
- **`java-jwt`**: JWT(JSON Web Token)를 생성하고 검증하기 위한 라이브러리입니다.

### 개발 및 테스트 의존성

- **`spring-boot-devtools`**: 개발 중 애플리케이션의 빠른 재시작 및 자동 구성 기능을 제공합니다.
- **`spring-boot-starter-test`**: 테스트를 위한 기본 프레임워크로, JUnit, Hamcrest, Mockito 등을 포함합니다.
- **`spring-security-test`**: 스프링 시큐리티와 관련된 테스트를 지원합니다.

## 구현된 기능

### 1. 회원가입
- **사용 클래스**: `AuthController`, `MemberService`, `MemberRepository`, `EmailService`
- 사용자가 회원가입을 요청하면, 사용자 정보를 데이터베이스에 저장하고 이메일 인증을 위한 토큰을 포함한 이메일을 발송합니다.

### 2. 로그인
- **사용 클래스**: `LoginController`, `JWTAuthenticationFilter`, `JWTUtil`, `MemberDetailService`
- 사용자가 로그인하면 인증 필터가 JWT 토큰을 생성하여 응답에 포함시킵니다.

### 3. 아이디 찾기
- **사용 클래스**: `AuthController`, `MemberService`, `MemberRepository`
- 사용자가 이메일과 닉네임을 입력하여 자신의 아이디를 찾을 수 있습니다.

### 4. 비밀번호 재설정
- **사용 클래스**: `AuthController`, `MemberService`, `MemberRepository`, `EmailService`
- 사용자가 비밀번호 재설정을 요청하면, 비밀번호 재설정 링크를 이메일로 발송하고, 링크를 통해 비밀번호를 재설정할 수 있습니다.

### 5. 게시판 관리
- **사용 클래스**: `BoardController`, `BoardService`, `BoardRepository`
- 사용자가 게시글을 작성, 조회, 수정, 삭제할 수 있습니다.

### 6. 댓글 관리
- **사용 클래스**: `CommentController`, `CommentService`, `CommentRepository`, `CreateCommentRequest`
- 사용자가 게시글에 댓글을 작성, 조회, 수정, 삭제할 수 있습니다.
- 특정 게시글에 달린 모든 댓글을 조회하거나, 댓글 작성자의 정보를 함께 조회할 수 있습니다.

이 애플리케이션은 위와 같은 기능들을 제공하며, Spring Boot와 Spring Security, JWT, OAuth2를 활용하여 구현되었습니다.
