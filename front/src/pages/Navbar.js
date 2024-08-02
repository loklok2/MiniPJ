import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <header className='fixed top-0 left-0 w-full h-full
                            bg-dark text-white'>
            <nav className="navbar navbar-expand-md 
                            navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" 
                          to="/">
                        부산 도보여행 정보
                    </Link>

                    <button className="navbar-toggler" 
                            type="button" 
                            data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                            aria-controls="navbarCollapse" 
                            aria-expanded="false" 
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" 
                         id="navbarCollapse">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                            <li className="nav-item">
                                <Link className="nav-link active"       
                                      aria-current="page" 
                                      to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" 
                                      to="/map">
                                    지도정보
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" 
                                      to="/login">
                                    마이페이지
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>
            </nav>
        </header>
    );
}
