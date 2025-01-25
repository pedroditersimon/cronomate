import LinkBtn from '../components/interactable/LinkBtn';
import Container from '../layouts/Container';
import PageLayout from '../layouts/PageLayout';

export function NotFound() {
    return (
        <Container className='text-center'>
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="mb-6">
                Sorry, the page you are looking for does not exist.
            </p>

            <LinkBtn to='/'>
                Go to Home
            </LinkBtn>
        </Container>
    );
};

export function NotFoundPage() {
    return (
        <PageLayout>
            <NotFound />
        </PageLayout>
    );
}
