import React from 'react';
import { useState } from 'react';

import uuid from 'react-uuid';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';

import { Section } from 'components/Section/Section';
import { DataInputForm } from 'components/DataInputForm/DataInputForm';
import { Contacts } from 'components/Contacts/Contacts';
import { Filter } from 'components/Filter/Filter';
import { useLocalStorage } from 'hooks/useLocalStorage';

export const App = () => {
  const defaultContacts = JSON.stringify([
    { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
    { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
    { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
    { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
  ]);
  const [contacts, setContacts] = useLocalStorage('contacts', defaultContacts);
  const [filter, setFilter] = useState('');

  const compareContacts = nameVal => {
    return contacts.find(
      ({ name }) => !nameVal.toLowerCase().localeCompare(name.toLowerCase())
    );
  };

  const filterContacts = () => {
    return contacts.filter(({ name }) =>
      name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  const submitName = ({ name, number }, actions) => {
    const matches = compareContacts(name);
    if (matches) {
      NotificationManager.warning(
        'Сontact with name ' + matches.name + ' already saved'
      );
      return;
    }
    setContacts(prev => [
      ...prev,
      {
        name,
        number,
        id: uuid().toString(),
      },
    ]);
    actions.resetForm();
  };

  const deleteName = deletedId => {
    setContacts(prev => prev.filter(contact => contact.id !== deletedId));
  };

  const handleChange = e => {
    setFilter(e.currentTarget.value.trim());
  };

  return (
    <>
      <Section title="Phonebook">
        <DataInputForm onSubmit={submitName}></DataInputForm>
      </Section>

      <Section title="Contacts">
        <Filter handleChange={handleChange}></Filter>
        <Contacts
          contactList={filterContacts()}
          deleteName={deleteName}
        ></Contacts>
      </Section>
      <NotificationContainer />
    </>
  );
};
