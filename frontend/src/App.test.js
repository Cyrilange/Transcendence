import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-router-dom', () => ({
	BrowserRouter: ({ children }) => children,
	Routes:				({ children }) => children,
	Route:				() => null,
	Link:					({ children, to }) => <a href={to}>{children}</a>,
	useNavigate:	() => () => {},
	useParams:		() => ({}),
}), { virtual: true });

jest.mock('@mui/joy/Sheet',			 () => ({ children }) => <div>{children}</div>, { virtual: true });
jest.mock('@mui/joy/styles',			() => ({ CssVarsProvider: ({ children }) => children }), { virtual: true });
jest.mock('@mui/joy/Button',			() => ({ children, onClick }) => <button onClick={onClick}>{children}</button>, { virtual: true });
jest.mock('@mui/joy/Stack',			 () => ({ children }) => <div>{children}</div>, { virtual: true });
jest.mock('@mui/joy/Modal',			 () => ({ children }) => <div>{children}</div>, { virtual: true });
jest.mock('@mui/joy/ModalDialog', () => ({ children }) => <div>{children}</div>, { virtual: true });
jest.mock('@mui/joy/ModalClose',	() => () => null, { virtual: true });
jest.mock('@mui/joy/Input',			 () => (props) => <input {...props} />, { virtual: true });
jest.mock('@mui/joy/Typography',	() => ({ children }) => <span>{children}</span>, { virtual: true });
jest.mock('@mui/joy/Badge',			 () => ({ children }) => <div>{children}</div>, { virtual: true });

jest.mock('./assets/components/theme.js',				() => ({}), { virtual: true });
jest.mock('./assets/styles/style.css',					 () => {}, { virtual: true });
jest.mock('./assets/components/buttons/menu.js', () => () => <nav data-testid="menu" />, { virtual: true });
jest.mock('./pages/home',				 () => () => <div data-testid="page-home">Home</div>, { virtual: true });
jest.mock('./pages/data-privacy', () => () => <div data-testid="page-privacy">Privacy</div>, { virtual: true });
jest.mock('./pages/imprint',			() => () => <div data-testid="page-imprint">Imprint</div>, { virtual: true });
jest.mock('./pages/GameRoom.jsx', () => () => <div data-testid="page-gameroom">GameRoom</div>, { virtual: true });

test('1. La App renderiza sin crashear', () => {
	render(<App />);
	expect(document.body).toBeInTheDocument();
});

test('2. El Header contiene el nombre "42SuperTrump"', () => {
	render(<App />);
	expect(screen.getByText('42SuperTrump')).toBeInTheDocument();
});

test('3. El Footer contiene enlace a Privacy Policy', () => {
	render(<App />);
	expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
});

test('4. El Footer contiene enlace a Terms of Service', () => {
	render(<App />);
	expect(screen.getByText(/Terms of service/i)).toBeInTheDocument();
});

test('5. El menú de navegación está presente', () => {
	render(<App />);
	expect(screen.getByTestId('menu')).toBeInTheDocument();
});
