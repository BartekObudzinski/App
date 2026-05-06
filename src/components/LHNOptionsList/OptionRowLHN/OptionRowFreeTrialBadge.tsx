import React from 'react';
import {useLHNTooltipContext} from '@components/LHNOptionsList/LHNTooltipContext';
import useOnyx from '@hooks/useOnyx';
import useThemeStyles from '@hooks/useThemeStyles';
import {isChatUsedForOnboarding as isChatUsedForOnboardingReportUtils} from '@libs/ReportUtils';
import FreeTrial from '@pages/settings/Subscription/FreeTrial';
import ONYXKEYS from '@src/ONYXKEYS';
import type {Report} from '@src/types/onyx';

type OptionRowFreeTrialBadgeProps = {
    /** Report backing this row, used to decide if the badge should appear */
    report?: Report;
};

/**
 * FreeTrial badge for an LHN row. Self-subscribes to the onboarding context and conciergeReportID
 * so the row's parent does not have to compute or pass this state down.
 */
function OptionRowFreeTrialBadge({report}: OptionRowFreeTrialBadgeProps) {
    const styles = useThemeStyles();
    const {onboarding, onboardingPurpose} = useLHNTooltipContext();
    const [conciergeReportID] = useOnyx(ONYXKEYS.CONCIERGE_REPORT_ID);

    if (!isChatUsedForOnboardingReportUtils(report, onboarding, conciergeReportID, onboardingPurpose)) {
        return null;
    }

    return <FreeTrial badgeStyles={[styles.mnh0, styles.pl2, styles.pr2, styles.ml1, styles.flexShrink1]} />;
}

OptionRowFreeTrialBadge.displayName = 'OptionRowFreeTrialBadge';

export default OptionRowFreeTrialBadge;
