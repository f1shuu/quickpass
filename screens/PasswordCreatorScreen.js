import Container from '../components/Container';

import { translate } from '../providers/LanguageProvider';

export default function PasswordCreatorScreen() {
    return (
        <Container title={translate('createPassword')} />
    )
}