import logo from '../assets/logo.png'

export default function Header() {
    return (
        <header>
            <img src={logo} alt="Chef Claude Logo" />
            <h1>Chef Claude</h1>
        </header>
    )
}