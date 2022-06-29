import React from 'react';

import {
  DataFrame,
  FALLBACK_COLOR,
  Field,
  getDisplayProcessor,
  getFieldDisplayName,
  TimeZone,
  LinkModel,
} from '@grafana/data';
import { LinkButton, SeriesTableRow, useTheme2, VerticalGroup } from '@grafana/ui';

interface StatusHistoryTooltipProps {
  data: DataFrame[];
  alignedData: DataFrame;
  seriesIdx: number;
  datapointIdx: number;
  timeZone: TimeZone;
}

export const StatusHistoryTooltip: React.FC<StatusHistoryTooltipProps> = ({
  data,
  alignedData,
  seriesIdx,
  datapointIdx,
  timeZone,
}) => {
  const theme = useTheme2();

  if (!data || datapointIdx == null) {
    return null;
  }

  const field = alignedData.fields[seriesIdx!];

  const links: Array<LinkModel<Field>> = [];
  const linkLookup = new Set<string>();

  if (field.getLinks) {
    const v = field.values.get(datapointIdx);
    const disp = field.display ? field.display(v) : { text: `${v}`, numeric: +v };
    field.getLinks({ calculatedValue: disp, valueRowIndex: datapointIdx }).forEach((link) => {
      const key = `${link.title}/${link.href}`;
      if (!linkLookup.has(key)) {
        links.push(link);
        linkLookup.add(key);
      }
    });
  }

  const dataFrameFieldIndex = field.state?.origin;
  const fieldFmt = field.display || getDisplayProcessor({ field, timeZone, theme });
  const value = field.values.get(datapointIdx!);
  const display = fieldFmt(value);
  const fieldDisplayName = dataFrameFieldIndex
    ? getFieldDisplayName(
        data[dataFrameFieldIndex.frameIndex].fields[dataFrameFieldIndex.fieldIndex],
        data[dataFrameFieldIndex.frameIndex],
        data
      )
    : null;

  return (
    <div style={{ fontSize: theme.typography.bodySmall.fontSize }}>
      {fieldDisplayName}
      <br />
      <SeriesTableRow label={display.text} color={display.color || FALLBACK_COLOR} isActive />
      {links.length > 0 && (
        <VerticalGroup>
          {links.map((link, i) => (
            <LinkButton
              key={i}
              icon={'external-link-alt'}
              target={link.target}
              href={link.href}
              onClick={link.onClick}
              fill="text"
              style={{ width: '100%' }}
            >
              {link.title}
            </LinkButton>
          ))}
        </VerticalGroup>
      )}
    </div>
  );
};

StatusHistoryTooltip.displayName = 'StatusHistoryTooltip';
