import Container from '../components/Container';

import { translate } from '../providers/LanguageProvider';

export default function PasswordsListScreen() {
    return (
        <Container title={translate('passwordsList')} />
    )
}