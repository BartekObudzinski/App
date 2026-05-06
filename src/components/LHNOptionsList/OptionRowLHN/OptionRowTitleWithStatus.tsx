import React from 'react';
import type {StyleProp, TextStyle} from 'react-native';
import {View} from 'react-native';
import DisplayNames from '@components/DisplayNames';
import Text from '@components/Text';
import Tooltip from '@components/Tooltip';
import useCurrentUserPersonalDetails from '@hooks/useCurrentUserPersonalDetails';
import useLocalize from '@hooks/useLocalize';
import useThemeStyles from '@hooks/useThemeStyles';
import DateUtils from '@libs/DateUtils';
import type {OptionData} from '@libs/ReportUtils';
import {isGroupChat, isOneOnOneChat, isSystemChat} from '@libs/ReportUtils';
import CONST from '@src/CONST';
import type {Report} from '@src/types/onyx';
import {isEmptyObject} from '@src/types/utils/EmptyObject';
import OptionRowFreeTrialBadge from './OptionRowFreeTrialBadge';

type OptionRowTitleWithStatusProps = {
    /** Option row data used for the title, tooltips, and status emoji */
    optionItem: OptionData;

    /** Report backing this row (drives group/system checks and status visibility) */
    report?: Report;

    /** Styles applied to the primary display name */
    displayNameStyle: StyleProp<TextStyle>;

    /** Row test id forwarded to DisplayNames */
    testID: number;
};

/** DisplayNames, onboarding FreeTrial badge, and 1:1 status emoji for an LHN row */
function OptionRowTitleWithStatus({optionItem, report, displayNameStyle, testID}: OptionRowTitleWithStatusProps) {
    const styles = useThemeStyles();
    const {translate} = useLocalize();
    const currentUserPersonalDetails = useCurrentUserPersonalDetails();

    const emojiCode = optionItem.status?.emojiCode ?? '';
    const statusText = optionItem.status?.text ?? '';
    const statusClearAfterDate = optionItem.status?.clearAfter ?? '';
    const currentSelectedTimezone = currentUserPersonalDetails?.timezone?.selected ?? CONST.DEFAULT_TIME_ZONE.selected;
    const formattedDate = DateUtils.getStatusUntilDate(translate, statusClearAfterDate, optionItem?.timezone?.selected ?? CONST.DEFAULT_TIME_ZONE.selected, currentSelectedTimezone);
    const statusContent = formattedDate ? `${statusText ? `${statusText} ` : ''}(${formattedDate})` : statusText;
    const isStatusVisible = !!emojiCode && isOneOnOneChat(!isEmptyObject(report) ? report : undefined);

    const shouldParseFullTitle = optionItem?.parentReportAction?.actionName !== CONST.REPORT.ACTIONS.TYPE.ADD_COMMENT && !isGroupChat(report);

    return (
        <View style={[styles.flexRow, styles.alignItemsCenter, styles.mw100, styles.overflowHidden]}>
            <DisplayNames
                accessibilityLabel={translate('accessibilityHints.chatUserDisplayNames')}
                fullTitle={optionItem.text ?? ''}
                shouldParseFullTitle={shouldParseFullTitle}
                displayNamesWithTooltips={optionItem.displayNamesWithTooltips ?? []}
                tooltipEnabled
                numberOfLines={1}
                textStyles={displayNameStyle}
                shouldUseFullTitle={
                    !!optionItem.isChatRoom ||
                    !!optionItem.isPolicyExpenseChat ||
                    !!optionItem.isTaskReport ||
                    !!optionItem.isThread ||
                    !!optionItem.isMoneyRequestReport ||
                    !!optionItem.isInvoiceReport ||
                    !!optionItem.private_isArchived ||
                    isGroupChat(report) ||
                    isSystemChat(report)
                }
                testID={testID}
            />
            <OptionRowFreeTrialBadge report={report} />
            {isStatusVisible && (
                <Tooltip
                    text={statusContent}
                    shiftVertical={-4}
                >
                    <Text style={styles.ml1}>{emojiCode}</Text>
                </Tooltip>
            )}
        </View>
    );
}

OptionRowTitleWithStatus.displayName = 'OptionRowTitleWithStatus';

export default OptionRowTitleWithStatus;
