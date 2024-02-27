import {LegacyCard, EmptyState} from '@shopify/polaris';
import React from 'react';

export function EmptyStatePage({heading ,onClick ,infoText}) {
  return (
    <>
      <EmptyState
        heading={heading}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <p>{infoText}</p>
      </EmptyState>
    </>
  );
}