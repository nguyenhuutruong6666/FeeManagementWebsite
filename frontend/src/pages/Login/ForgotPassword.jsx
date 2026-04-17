import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import './Login.scss';

const STEPS = { EMAIL: 1, OTP: 2, NEW_PASSWORD: 3, SUCCESS: 4 };

const IconLock = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
const IconMail = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);
const IconEye = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const IconEyeOff = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(STEPS.EMAIL);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await authService.sendOtp(email);
            if (res.success) {
                setStep(STEPS.OTP);
                setCountdown(60);
                setTimeout(() => otpRefs[0].current?.focus(), 100);
            }
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 3) otpRefs[index + 1].current?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        const newOtp = ['', '', '', ''];
        for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
        setOtp(newOtp);
        const nextIdx = Math.min(pasted.length, 3);
        otpRefs[nextIdx].current?.focus();
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        const code = otp.join('');
        if (code.length < 4) { setError('Vui lòng nhập đủ 4 chữ số.'); return; }
        setLoading(true);
        try {
            const res = await authService.checkOtp(email, code);
            if (res.success) setStep(STEPS.NEW_PASSWORD);
        } catch (err) {
            setError(err.message || 'Mã OTP không đúng. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setError('');
        setLoading(true);
        try {
            const res = await authService.sendOtp(email);
            if (res.success) {
                setOtp(['', '', '', '']);
                setCountdown(60);
                setTimeout(() => otpRefs[0].current?.focus(), 100);
            }
        } catch (err) {
            setError(err.message || 'Không thể gửi lại mã. Thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); return; }
        if (newPassword.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
        setLoading(true);
        try {
            const res = await authService.verifyOtpAndReset({
                email,
                otp: otp.join(''),
                newPassword,
                confirmPassword,
            });
            if (res.success) setStep(STEPS.SUCCESS);
        } catch (err) {
            setError(err.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
            if (err.message?.includes('OTP')) setStep(STEPS.OTP);
        } finally {
            setLoading(false);
        }
    };

    const stepMeta = {
        [STEPS.EMAIL]:        { title: 'Quên mật khẩu',       sub: 'Nhập email để nhận mã xác thực' },
        [STEPS.OTP]:          { title: 'Nhập mã xác thực',     sub: `Mã 4 chữ số đã được gửi đến ${email}` },
        [STEPS.NEW_PASSWORD]: { title: 'Mật khẩu mới',         sub: 'Tạo mật khẩu mới cho tài khoản của bạn' },
        [STEPS.SUCCESS]:      { title: 'Thành công!',           sub: 'Mật khẩu đã được cập nhật' },
    };

    return (
        <div className="login-page">
            <div className="login-card forgot-card">

                <div className="brand">
                    <div className="forgot-icon">
                        <IconLock />
                    </div>
                    <h2>{stepMeta[step].title}</h2>
                    <p>{stepMeta[step].sub}</p>
                </div>

                <div className="fp-steps">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`fp-step ${step >= s ? 'active' : ''} ${step > s ? 'done' : ''}`}>
                            <div className="fp-step-dot">{step > s ? '✓' : s}</div>
                            {s < 3 && <div className="fp-step-line" />}
                        </div>
                    ))}
                </div>

                {error && <div className="fp-error">{error}</div>}

                {step === STEPS.EMAIL && (
                    <form className="auth-form" onSubmit={handleSendOtp}>
                        <div className="input-wrapper">
                            <input
                                type="email"
                                placeholder="Địa chỉ Email đã đăng ký..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                            <span className="input-icon"><IconMail /></span>
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Đang gửi...' : 'GỬI MÃ XÁC THỰC'}
                        </button>
                    </form>
                )}

                {step === STEPS.OTP && (
                    <form className="auth-form" onSubmit={handleVerifyOtp}>
                        <div className="otp-group" onPaste={handleOtpPaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={otpRefs[i]}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    className={`otp-box ${digit ? 'filled' : ''}`}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                />
                            ))}
                        </div>

                        <div className="fp-resend">
                            {countdown > 0 ? (
                                <span className="fp-resend-timer">Gửi lại sau <strong>{countdown}s</strong></span>
                            ) : (
                                <button type="button" className="fp-resend-btn" onClick={handleResendOtp} disabled={loading}>
                                    Gửi lại mã
                                </button>
                            )}
                        </div>

                        <button type="submit" className="btn-submit" disabled={otp.join('').length < 4 || loading}>
                            {loading ? 'Đang xác thực...' : 'XÁC NHẬN MÃ'}
                        </button>
                        <button type="button" className="btn-back" onClick={() => { setStep(STEPS.EMAIL); setError(''); }}>
                            ← Thay đổi email
                        </button>
                    </form>
                )}

                {step === STEPS.NEW_PASSWORD && (
                    <form className="auth-form" onSubmit={handleResetPassword}>
                        <div className="input-wrapper">
                            <input
                                type={showNew ? 'text' : 'password'}
                                className="has-toggle"
                                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                autoFocus
                            />
                            <span className="input-icon"><IconLock /></span>
                            <button type="button" className="toggle-password" onClick={() => setShowNew(p => !p)} aria-label="Toggle">
                                {showNew ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                className="has-toggle"
                                placeholder="Xác nhận mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span className="input-icon"><IconLock /></span>
                            <button type="button" className="toggle-password" onClick={() => setShowConfirm(p => !p)} aria-label="Toggle">
                                {showConfirm ? <IconEyeOff /> : <IconEye />}
                            </button>
                        </div>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Đang cập nhật...' : 'ĐẶT LẠI MẬT KHẨU'}
                        </button>
                        <button type="button" className="btn-back" onClick={() => { setStep(STEPS.OTP); setError(''); }}>
                            ← Quay lại nhập mã
                        </button>
                    </form>
                )}

                {step === STEPS.SUCCESS && (
                    <div className="fp-success">
                        <div className="fp-success-icon">✓</div>
                        <p>Mật khẩu của bạn đã được cập nhật thành công.</p>
                        <button className="btn-login-now" onClick={() => navigate('/login')}>
                            ĐĂNG NHẬP NGAY
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </button>
                    </div>
                )}

                {step !== STEPS.SUCCESS && (
                    <div className="auth-footer">
                        Nhớ ra mật khẩu rồi? <Link to="/login">Trở về Đăng nhập</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
