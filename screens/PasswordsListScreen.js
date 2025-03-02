import Container from '../components/Container';

import { translate } from '../providers/LanguageProvider';

export default function PasswordsScreen() {
    return (
        <Container title={translate('passwordsList')} />
    )
}