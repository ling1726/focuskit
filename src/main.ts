import './style.css'
import './umd';

import TrapScenario from "./scenarios/TrapAcenario";
import DisabledScenario from './scenarios/DisabledScenario';
import TrapGroupScenario from './scenarios/TrapGroupScenario';
import NestedListTrapGroup from './scenarios/x';
import ArrowZoneScenario from './scenarios/ArrowZoneScenario';
import ListGroup from './scenarios/ListGroup';
import ListInTrapGroup from './scenarios/ListInTrapGroup';

TrapGroupScenario(document.getElementById('app')!);
