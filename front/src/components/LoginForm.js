import { useState, useRef } from "react";
import { Button, Container, Row, Col, Form } from 'react-bootstrap';

export default function LoginForm({ onLogin }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();

        // Clear previous errors
        setError('');

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        if (email === '') {
            setError('이메일을 입력하세요.');
            emailRef.current.focus();
            return;
        }

        if (password === '') {
            setError('비밀번호를 입력하세요.');
            passwordRef.current.focus();
            return;
        }

        fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: email, password: password }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.');
                }
                return response.json();
            })
            .then(data => {
                onLogin(email); // 로그인 성공 시 부모 컴포넌트로 사용자 정보를 전달
            })
            .catch(err => {
                setError(err.message);
            });
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row>
                <Col md={6} className="mx-auto">
                    <div className="bg-white rounded shadow-sm p-4">
                        <h1 className="text-center mb-4">로그인</h1>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <Form onSubmit={handleSignIn}>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Your email</Form.Label>
                                <Form.Control
                                    type="email"
                                    ref={emailRef}
                                    placeholder="name@company.com"
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mt-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    ref={passwordRef}
                                    placeholder="••••••••"
                                    required
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                className="w-100 mt-3"
                                variant="primary"
                            >
                                Sign in
                            </Button>
                        </Form>
                        <Button
                            className="w-100 mt-3"
                            variant="outline-secondary"
                            onClick={() => alert('회원가입 페이지로 이동')}
                        >
                            Sign Up
                        </Button>
                        <div className="divider d-flex align-items-center my-4">
                            <p className="text-center fw-bold mx-3 mb-0">OR</p>
                        </div>
                        <Button
                            className="mb-2 w-100"
                            size="lg"
                            style={{ backgroundColor: '#dd4b39' }}
                            onClick={() => alert('Google OAuth2 로그인')}
                        >
                            <i className="fab fa-google mx-2"></i>
                            Sign in with Google
                        </Button>
                        <Button
                            className="mb-2 w-100"
                            size="lg"
                            style={{ backgroundColor: '#1da1f2' }}
                            onClick={() => alert('Naver OAuth2 로그인')}
                        >
                            <i className="fab fa-nav mx-2"></i>
                            Sign in with Naver
                        </Button>
                        <Button
                            className="mb-4 w-100"
                            size="lg"
                            style={{ backgroundColor: '#ffcd00' }}
                            onClick={() => alert('Kakao OAuth2 로그인')}
                        >
                            <i className="fab fa-kakao mx-2"></i>
                            Sign in with Kakao
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
