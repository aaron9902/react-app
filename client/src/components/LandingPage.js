import { withRouter } from 'react-router-dom';

function LandingPage(props) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
            <h2>Landing Page</h2>
        </div>
    )
}
export default withRouter(LandingPage);
